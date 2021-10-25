import { execSync } from "child_process";
import { CiEnv } from "env-ci";
import { getCurrentBranch } from "../auto";

jest.mock('child_process')

describe('getCurrentBranch', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('when isPr', () => {
        it('returns pr branch from env ci when valid', () => {
            const env: Partial<CiEnv> = {
                isPr: true,
                prBranch: 'my-pr-branch'
            }
            expect(getCurrentBranch(env)).toBe('my-pr-branch')
        });

        it('tries git command when PR is invalid', () => {
            const env: Partial<CiEnv> = {
                isPr: true,
                prBranch: 'undefined'
            }

            getCurrentBranch(env);

            expect(execSync).toHaveBeenCalledWith("git symbolic-ref --short HEAD", {
                encoding: "utf8",
                stdio: "ignore",
            })
        });
    })

    describe('when not isPr', () => {

        it('returns pr branch from env ci when valid', () => {
            const env: Partial<CiEnv> = {
                isPr: false,
                prBranch: 'my-pr-branch',
                branch: 'my-release-branch'
            }

            expect(getCurrentBranch(env)).toBe('my-release-branch');

            expect(execSync).not.toHaveBeenCalled()
        });

        it('tries git command when branch name is invalid', () => {
            const env: Partial<CiEnv> = {
                isPr: false,
                prBranch: 'my-pr-branch',
                branch: undefined
            }
            getCurrentBranch(env);

            expect(execSync).toHaveBeenCalledWith("git symbolic-ref --short HEAD", {
                encoding: "utf8",
                stdio: "ignore",
            })
        });
    })
})