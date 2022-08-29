# Is Organization Member

This action returns if someone belongs to a certain organization or not.

## Usage

An example workflow using the action:

```yaml
name: Is Organization Member Example

on: pull_request_target

jobs:
  welcome:
    name: Welcome
    runs-on: ubuntu-latest
    steps:
      - name: Check if organization member
        id: is_organization_member
        uses: radtriste/is-organization-member@kiegroup_use
        with:
          organization: kiegroup
          username: ${{ github.event.issue.user.login }}
          token: ${{ secrets.SECRET_WITH_READ_ORG_TOKEN }}
      - name: Debug log
        if: |
          steps.is_organization_member.outputs.result == false
        run: echo User Does Not Belong to kiegroup
```

> **Note:** The used secret `SECRET_WITH_READ_ORG_TOKEN` does only need the `read:org` scope from the organization you try to read.
