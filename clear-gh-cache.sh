#!/bin/bash

gh api -H "Accept: application/vnd.github+json" --paginate \
        /repos/boomll/mpc/actions/caches \
        | for ID in `jq '.actions_caches[].id'`; \
          do echo "Deleting $ID"; \
            gh api --method DELETE /repos/boomll/mpc/actions/caches/$ID
            done
