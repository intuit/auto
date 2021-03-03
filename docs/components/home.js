/* eslint-disable @typescript-eslint/no-unused-vars, jsdoc/require-jsdoc */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import {
  faFireAlt,
  faWrench,
  faAtom,
  faBacon,
} from "@fortawesome/free-solid-svg-icons";
import { GetStarted } from "./get-started-button";
import { Label } from "./label";

const Feature = ({ title, description, icon }) => (
  <div className="mb-8 flex items-start last:mb-0">
    <div className="rounded bg-yellow-500 dark:bg-yellow-600 p-3 text-yellow-100 mr-5">
      <FontAwesomeIcon height={24} icon={icon} />
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-lg text-gray-700 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

const Link = (props) => (
  <a className="text-blue-600 font-semibold underline" {...props} />
);

const Emphasize = ({ children }) => (
  <span className="text-primary-500 dark:text-primary-400 font-semibold">
    {children}
  </span>
);

const Divider = ({ style }) => (
  <hr className="mb-8 text-gray-300" style={style} />
);

const getImageProps = (image) =>
  typeof image === "object"
    ? { src: image.src.src, srcset: image.src.srcSet }
    : { src: image };

const Step = ({ number, label, image }) => (
  <div className="flex items-center flex-col lg:flex-row mb-8 w-fit lg:w-full">
    <div className="flex items-center flex-1 pr-4 mb-6 lg:mb-0 self-start lg:self-auto">
      <div className="bg-gray-700 rounded-full h-12 w-12 text-gray-100 flex items-center justify-center">
        {number}
      </div>
      <h3 className="pl-4 flex-1">{label}</h3>
    </div>
    <img
      className="lg:flex-1 w-full lg:max-w-lg border border-gray-300 rounded-lg h-auto"
      {...getImageProps(image)}
    />
  </div>
);

const FrequentlyAskedQuestion = ({ question, answer }) => (
  <div className="mb-10 last:mb-0">
    <h4 className="font-normal text-xl mb-3 text-gray-700 dark:text-gray-200">
      {question}
    </h4>
    <p className="text-grey-800 leading-relaxed">{answer}</p>
  </div>
);

const ContentWrapper = (props) => (
  <div className="mx-10 md:max-w-screen-xl lg:mx-auto" {...props} />
);

const FAQ = () => (
  <ContentWrapper>
    <div className="bg-grey-500">
      <div className="max-w-4xl mx-10 lg:mx-auto pt-12 pb-24">
        <h2 className="font-extrabold text-4xl text-center mb-6 text-gray-800 dark:text-gray-300">
          Frequently asked questions
        </h2>

        <Divider style={{ borderTopWidth: 2, height: 2 }} />

        <FrequentlyAskedQuestion
          question={
            <>
              Do you really release{" "}
              <span className="font-extrabold italic"> every </span> pull
              request?!
            </>
          }
          answer={
            <>
              <Link href="https://github.com/intuit/auto/releases">Yup!</Link>{" "}
              But if you don't want to do that it's up to you. The tools{" "}
              <Emphasize>auto</Emphasize> ships with can be used to{" "}
              <span className="font-semibold text-red-500 dark:text-red-600">
                fit any workflow
              </span>
              ! You can also use <Label color="primary">skip-release</Label>{" "}
              labels or configure <Emphasize>auto</Emphasize> to only release
              with a <Label color="blue">release</Label> label.
            </>
          }
        />

        <Divider style={{ height: 1 }} />

        <FrequentlyAskedQuestion
          question={
            <>
              Is there a way to hook into <Emphasize>auto</Emphasize> and
              customize my release process?
            </>
          }
          answer={
            <>
              Many of <Emphasize>auto</Emphasize>'s features are{" "}
              <Link href="https://intuit.github.io/auto/docs/configuration/plugins">
                built into plugins
              </Link>
              . You can also use this plugin system to do{" "}
              <span className="font-semibold text-red-500 dark:text-red-600">
                almost anything
              </span>{" "}
              during your release!
            </>
          }
        />

        <Divider style={{ height: 1 }} />

        <FrequentlyAskedQuestion
          question={
            <>
              Does <Emphasize>auto</Emphasize> support any other types of
              releases?
            </>
          }
          answer={
            <>
              <p className="mb-3">
                Yes! <Emphasize>auto</Emphasize> has commands for any situation!
              </p>

              <p className="mb-2">
                Want a test version? Try a{" "}
                <Link href="https://intuit.github.io/auto/docs/generated/canary">
                  canary
                </Link>
              </p>

              <p className="mb-2">
                Want a prerelease? Try creating a pre-release branch and using{" "}
                <Link href="https://intuit.github.io/auto/docs/generated/next">
                  next
                </Link>
              </p>

              <p className="mb-2">
                Need to patch an old major release? <Emphasize>auto</Emphasize>{" "}
                can automatically make branches for{" "}
                <Link href="https://intuit.github.io/auto/docs/generated/shipit#managing-old-major-versions">
                  old major versions
                </Link>
                !
              </p>

              <p>
                Or if you don't want to worry about what command to you need,
                just use{" "}
                <Link href="https://intuit.github.io/auto/docs/generated/shipit">
                  shipit
                </Link>
                ! This command determines what type of release to make based on
                the context it's run in.
              </p>
            </>
          }
        />
      </div>
    </div>
  </ContentWrapper>
);

const SampleWorkflow = () => (
  <ContentWrapper>
    <div className="max-w-4xl mx-10 lg:mx-auto pt-20 pb-16 lg:pb-24">
      <h2 className="text-center text-2xl font-semibold mb-16 lg:mb-20">
        What does the workflow look like? How easy is it really?
      </h2>

      <Step number={1} label="Open a Pull Request" image="open-pr.png" />
      <Step
        number={2}
        image="add-label.png"
        label={
          <>
            Add a <Label color="blue">label</Label>
          </>
        }
      />
      <Step number={3} label="Hit that merge button" image="merge.png" />
      <Step
        number={4}
        image="release-example.png"
        label="Wait for your continuous integration to make the release for you!"
      />
    </div>
  </ContentWrapper>
);

const Features = () => (
  <ContentWrapper>
    <div className="flex justify-around items-center flex-col-reverse lg:flex-row mb-16 lg:mb-24">
      <div className="flex-1 lg:px-12">
        <Feature
          title="Keep Your Workflow"
          icon={faWrench}
          description={
            <>
              Other tools require you to change how any contributor commits to
              your project. With <Emphasize>auto </Emphasize>
              leave that baggage behind!
            </>
          }
        />

        <Feature
          title="Beautiful Changelogs"
          icon={faBacon}
          description="Link to PRs and Jira stories, include authors, monorepo aware, customizable labels section, additional release notes, and even more!"
        />

        <Feature
          title="Atomic Functions"
          icon={faAtom}
          description="Each command does one thing and they do it well. Easily use them to fit any build process."
        />

        <Feature
          title="Blazingly Fast Releases"
          icon={faFireAlt}
          description="Since all you need to worry about are labels, you can work at an incredibly fast pace! This speed to commit also helps with new contributors."
        />
      </div>

      <div className="flex-1 px-12 mb-20 lg:mb-0">
        <img
          src="changelog-example.png"
          alt="Changelog example"
          className="border border-grey-600 rounded-lg p-4 shadow-md mx-auto"
          style={{ maxHeight: 500 }}
        />
      </div>
    </div>
  </ContentWrapper>
);

const ReleaseType = ({ type, description, color = "primary" }) => (
  <div className={`${color} rounded-xl flex-1 py-6 px-8`}>
    <h3 className="text-white text-2xl mb-4 font-semibold">{type}</h3>
    <p className="text-gray-100">{description}</p>
  </div>
);

const ReleaseTypes = () => (
  <div className="w-full bg-gray-100 dark:bg-gray-900 py-20">
    <ContentWrapper>
      <div className="flex flex-col lg:px-12">
        <h2 className="text-4xl font-bold mb-6 dark:text-white">
          A release for any situation!
        </h2>
        <p className="text-xl max-w-4xl text-gray-800 dark:text-gray-200 mb-10">
          <Emphasize>auto</Emphasize> can create multiple types of releases.
          Each release type guarantees that no matter the situation you'll be
          able to publish and consume a release with your changes.
        </p>

        <div className="flex flex-col space-y-4 lg:space-y-0 lg:space-x-6 lg:flex-row w-full">
          <ReleaseType
            color="bg-primary-500"
            type="canary"
            description="PR build previews that enable your project's consumers to easily test changes."
          />
          <ReleaseType
            color="bg-yellow-600"
            type="next"
            description="Easily create and manage pre-releases for your project as you develop large changes."
          />
          <ReleaseType
            color="bg-red-700"
            type="latest"
            description="Publish a new full release for the project. Creates changelogs, github releases, and more!"
          />
        </div>
      </div>
    </ContentWrapper>
  </div>
);

const Hero = () => (
  <div className="w-full">
    <div className="bg-primary-500 dark:bg-primary-600 w-full flex justify-center flex-col items-center py-40 text-center">
      <img
        src="monochrome-logo-large.png"
        alt="auto"
        className="w-1/4 mb-10 max-w-md"
      />

      <p className="text-2xl text-primary-200 font-light mx-4">
        Streamline your release workflow and{" "}
        <span className="text-yellow-500 font-semibold">
          publish constantly!
        </span>
      </p>
    </div>

    <div className="mx-10 md:max-w-screen-xl lg:mx-auto">
      <div className="mt-10 mb-16 lg:mb-24 text-center flex items-center flex-col">
        <h2 className="text-primary-900 text-2xl mb-8 font-semibold dark:text-primary-200">
          Adding automated releases shouldn't be hard or require changing your
          workflow
        </h2>

        <p className="max-w-2xl text-lg text-gray-700 dark:text-gray-400">
          <Emphasize>auto</Emphasize> makes automating releases for your project
          as simple adding a <Label color="yellow">label</Label> to a pull
          request. If you're releasing all the time you can be{" "}
          <span className="text-red-500 dark:text-red-600 font-semibold">
            more confident
          </span>{" "}
          in your releases. And your users might thank you too 😉
        </p>
      </div>
    </div>
  </div>
);

const Home = () => (
  <div className="w-full">
    <Head>
      <title>Auto</title>
    </Head>

    <main className="w-full">
      <Hero />

      <Features />

      <ReleaseTypes />

      <SampleWorkflow />

      <FAQ />

      <div className="bg-primary-500 dark:bg-primary-600 text-white text-center">
        <div className="max-w-4xl mx-10 lg:mx-auto pt-12 pb-20 flex flex-col items-center">
          <h2 className="text-xl mb-8">
            Stop worrying about your release and hit that merge button!
          </h2>

          <GetStarted />
        </div>
      </div>
    </main>
  </div>
);

export default Home;
