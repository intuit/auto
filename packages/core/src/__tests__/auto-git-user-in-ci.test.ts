import { Auto } from "../auto";
import execPromise from "../utils/exec-promise";

const exec = vi.fn();
vi.mock("../utils/exec-promise");
// @ts-ignore
execPromise.mockImplementation(exec);
exec.mockImplementation(() => {
  throw new Error();
});

vi.mock("env-ci", () => ({
  default: () => ({
    isCi: true,
  }),
}));

const defaults = {
  owner: "foo",
  repo: "bar",
};

test("parses string author in config", async () => {
  const auto = new Auto({ ...defaults, plugins: [] });

  // @ts-ignore
  auto.config = { author: "Andrew <andrew@mail.com>" };

  // @ts-ignore
  expect(await auto.getGitUser()).toStrictEqual({
    name: "Andrew",
    email: "andrew@mail.com",
  });
});

test("parses object author in config", async () => {
  const auto = new Auto({ ...defaults, plugins: [] });
  const author = {
    name: "Andrew",
    email: "andrew@mail.com",
  };

  // @ts-ignore
  auto.config = { author };

  // @ts-ignore
  expect(await auto.getGitUser()).toStrictEqual(author);
});
