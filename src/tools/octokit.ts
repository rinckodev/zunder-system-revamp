import { Octokit } from "@octokit/core";
import { components } from "@octokit/openapi-types";

export const octokit = new Octokit();

export type GithubUser = components["schemas"]["public-user"];
export type GithubRepository = components["schemas"]["repository"];