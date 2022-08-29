console.log("STARTED");

const cp = require("child_process");
cp.execSync(`cd ${__dirname}; npm ci`);

const core = require("@actions/core");
const github = require("@actions/github");

const organization = core.getInput("organization", { required: true });
const username = core.getInput("username", { required: true });
const token = core.getInput("token", { required: true });

const octokit = new github.getOctokit(token);

main();

async function main() {
  core.info("username= "+username)
  core.info("organization= "+organization)

  const parameters = { 
    org: organization, 
    filter: 'all',
    role: 'all',
    per_page: 100 
  }
  core.setOutput("result", "false");
  for await (const response of octokit.paginate.iterator(
    octokit.rest.orgs.listMembers,
    parameters
  )) {
    const result = checkStatus(response)
    const members = result.data;
    console.log("%d members found", members.length);
    const isMember = members.some(({ login }) => login === username);

    if (isMember) {
      core.setOutput("result", "true");
      break
    }
  }
}

function checkStatus(result) {
  core.info('check Status of response')
  core.info('status received = ' + result.status)
  if (result.status >= 200 && result.status < 300) {
    return result;
  }

  core.setFailed(`Received status ${result.status} from API.`);
  process.exit();
}
