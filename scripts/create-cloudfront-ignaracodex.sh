#!/usr/bin/env bash
# Create CloudFront distribution for ignaracodex.com → S3 dreampath-codex-frontend (OAC).
# Prerequisites: ACM cert ISSUED in us-east-1 for ignaracodex.com + www.
set -euo pipefail

CERT_ARN="${CERT_ARN:-arn:aws:acm:us-east-1:920373010909:certificate/814c958e-e655-4bfb-bdff-fd3e958f8414}"
OAC_ID="${OAC_ID:-E2RTUGMYQJQLN8}"
BUCKET="dreampath-codex-frontend"
REGION="us-east-1"
CALLER_REF="ignaracodex-$(date +%s)"

STATUS=$(aws acm describe-certificate --region us-east-1 --certificate-arn "$CERT_ARN" \
  --query 'Certificate.Status' --output text 2>/dev/null || echo "UNKNOWN")

if [[ "$STATUS" != "ISSUED" ]]; then
  echo "ACM certificate status is '$STATUS' (need ISSUED)."
  echo "Set ignaracodex.com nameservers at your registrar to Route 53 (see docs/IGNARACODEX_AWS_SETUP.md), wait for validation, then re-run."
  exit 1
fi

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

# Managed-CachingOptimized
CACHE_POLICY_ID="658327ea-f89d-4fab-a63d-7e88639e58f6"

cat >"$TMP" <<EOF
{
  "CallerReference": "$CALLER_REF",
  "Comment": "Ignara ignaracodex.com frontend",
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-$BUCKET",
        "DomainName": "$BUCKET.s3.$REGION.amazonaws.com",
        "OriginAccessControlId": "$OAC_ID",
        "S3OriginConfig": { "OriginAccessIdentity": "" }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-$BUCKET",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"], "CachedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"] } },
    "Compress": true,
    "CachePolicyId": "$CACHE_POLICY_ID"
  },
  "Aliases": { "Quantity": 2, "Items": ["ignaracodex.com", "www.ignaracodex.com"] },
  "ViewerCertificate": {
    "ACMCertificateArn": "$CERT_ARN",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "PriceClass": "PriceClass_100",
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      { "ErrorCode": 403, "ResponsePagePath": "/index.html", "ResponseCode": "200", "ErrorCachingMinTTL": 0 },
      { "ErrorCode": 404, "ResponsePagePath": "/index.html", "ResponseCode": "200", "ErrorCachingMinTTL": 0 }
    ]
  }
}
EOF

echo "Creating CloudFront distribution..."
OUT=$(aws cloudfront create-distribution --distribution-config "file://$TMP" --output json)
DIST_ID=$(echo "$OUT" | jq -r '.Distribution.Id')
DIST_DOMAIN=$(echo "$OUT" | jq -r '.Distribution.DomainName')
DIST_ARN=$(echo "$OUT" | jq -r '.Distribution.ARN')

echo ""
echo "Distribution ID: $DIST_ID"
echo "CloudFront domain: $DIST_DOMAIN"
echo ""
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
cat <<POLICY
Add this S3 bucket policy to $BUCKET (replace if already present — merge Statement array):

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "$DIST_ARN"
        }
      }
    }
  ]
}

POLICY

echo "Then in Route 53 (hosted zone Z09933851X45P0DFXKPPX):"
echo "  A + AAAA alias ignaracodex.com    → $DIST_DOMAIN"
echo "  A + AAAA alias www.ignaracodex.com → $DIST_DOMAIN"
echo ""
echo "Invalidate cache after deploy:"
echo "  aws cloudfront create-invalidation --distribution-id $DIST_ID --paths \"/*\""
