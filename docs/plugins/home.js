import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFireAlt,
  faWrench,
  faAtom,
  faBacon
} from '@fortawesome/free-solid-svg-icons';
import openPrImage from './open-pr.png';
import addLabelImage from './add-label.png';
import mergeImage from './merge.png';
import releaseImage from './release.png';
import changelogExampleImage from './changelog-example.png';

import './tailwind.plugin.css';

const Feature = ({ title, description, icon }) => (
  <div className="mb-8 flex items-start last:mb-0">
    <div className="rounded bg-yellow-500 p-3 text-yellow-100 mr-5">
      <FontAwesomeIcon height={24} icon={icon} />
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-lg text-gray-700">{description}</p>
    </div>
  </div>
);

const Link = props => (
  <a className="text-blue-600 font-semibold underline" {...props} />
);

const Emphasize = ({ children }) => (
  <span className="text-purple-500 font-semibold">{children}</span>
);

const Divider = ({ style }) => (
  <hr className="mb-8 text-gray-300" style={style} />
);

const getImageProps = image =>
  typeof image === 'object'
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

const Label = ({ children, color }) => (
  <span
    className={`bg-${color}-600 text-white px-2 py-1 rounded font-semibold text-xs`}
  >
    {children}
  </span>
);

const FrequentlyAskedQuestion = ({ question, answer }) => (
  <div className="mb-10 last:mb-0">
    <h4 className="font-normal text-xl mb-3 text-gray-700">{question}</h4>
    <p className="text-grey-800 leading-relaxed">{answer}</p>
  </div>
);

const Home = () => (
  <div className="w-full">
    <main className="w-full">
      <div className="w-full">
        <div className="bg-purple-600 w-full flex justify-center flex-col items-center py-40 text-center">
          <h1 className="text-6xl font-bold text-white">auto</h1>

          <p className="text-2xl text-purple-200 font-light">
            Streamline your release workflow and{' '}
            <span className="text-yellow-500 font-semibold">
              publish constantly!
            </span>
          </p>
        </div>

        <div className="mx-10 md:max-w-screen-xl lg:mx-auto">
          <div className="mt-10 mb-16 lg:mb-24 text-center flex items-center flex-col">
            <h2 className="text-purple-900 text-2xl mb-8 font-semibold">
              Adding automated releases shouldn't be hard or require changing
              your workflow
            </h2>

            <p className="max-w-2xl text-lg text-gray-700">
              <Emphasize>auto</Emphasize> makes automating releases for your
              project as simple adding a <Label color="yellow">label</Label> to
              a pull request. If you're releasing all the time you can be{' '}
              <span className="text-red-500 font-semibold">more confident</span>{' '}
              in your releases. And your users might thank you too 😉
            </p>
          </div>

          <div className="flex justify-around items-center flex-col-reverse lg:flex-row mb-16 lg:mb-24">
            <div className="flex-1 lg:px-12">
              <Feature
                title="Keep Your Workflow"
                icon={faWrench}
                description={
                  <p>
                    Other tools require you to change how any contributor
                    commits to you project. With <Emphasize>auto</Emphasize>{' '}
                    leave that baggage behind!
                  </p>
                }
              />

              <Feature
                title="Beautiful Changelogs"
                icon={faBacon}
                description="Link to PRs and Jira stories, include authors, monorepo aware,
                  customizable labels section, additional release notes, and even
                  more!"
              />

              <Feature
                title="Atomic Functions"
                icon={faAtom}
                description="Each command does one thing and they do it well. Easily use
                them to fit any build process."
              />

              <Feature
                title="Blazingly Fast Releases"
                icon={faFireAlt}
                description="Since all you need to worry about are labels you can work at an incredibly fast pace! This speed to commit also helps with new contributors"
              />
            </div>

            <div className="flex-1 px-12 mb-20 lg:mb-0">
              <img
                {...getImageProps(changelogExampleImage)}
                alt="Changelog example"
                className="border border-grey-600 rounded-lg p-4 shadow-md"
                style={{ maxHeight: 500 }}
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-10 lg:mx-auto pt-12 pb-16 lg:pb-24">
          <Divider style={{ height: 1 }} />
          <h2 className="text-center text-2xl font-semibold mt-12 mb-16 lg:mb-20">
            What does the workflow look like? How easy is it really?
          </h2>

          <Step number={1} label="Open a Pull Request" image={openPrImage} />
          <Step
            number={2}
            image={addLabelImage}
            label={
              <>
                Add a <Label color="blue">label</Label>
              </>
            }
          />
          <Step number={3} label="Hit that merge button" image={mergeImage} />
          <Step
            number={4}
            image={releaseImage}
            label="Wait for you continuous integration to make the release for you!"
          />
        </div>

        <div className="bg-grey-500">
          <div className="max-w-4xl mx-10 lg:mx-auto pt-12 pb-24">
            <h2 className="font-extrabold text-4xl text-center mb-6 text-gray-800">
              Frequently asked questions
            </h2>

            <Divider style={{ borderTopWidth: 2, height: 2 }} />

            <FrequentlyAskedQuestion
              question={
                <>
                  Do you really release{' '}
                  <span className="font-extrabold italic"> every </span> pull
                  request?!
                </>
              }
              answer={
                <>
                  <Link href="https://github.com/intuit/auto/releases">
                    Yup!
                  </Link>{' '}
                  But if you don't want to do that it's up to you. The tools{' '}
                  <Emphasize>auto</Emphasize> ships with can be used to{' '}
                  <span className="font-semibold text-red-600">
                    fit any workflow
                  </span>
                  ! You can also use <Label color="purple">skip-release</Label>{' '}
                  labels or configure <Emphasize>auto</Emphasize> to only
                  release with a <Label color="blue">release</Label> label.
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
                  Many of <Emphasize>auto</Emphasize>'s features are{' '}
                  <Link href="https://intuit.github.io/auto/pages/plugins.html">
                    built into plugins
                  </Link>
                  . You can also use this plugin system to do{' '}
                  <span className="font-semibold text-red-600">
                    almost anything
                  </span>{' '}
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
                    Yes! <Emphasize>auto</Emphasize> has commands for any
                    situation!
                  </p>

                  <p className="mb-2">
                    Want a test version? Try a{' '}
                    <Link href="https://intuit.github.io/auto/pages/generated/canary.html">
                      canary
                    </Link>
                  </p>

                  <p className="mb-2">
                    Want a prerelease? Try creating a pre-release branch and
                    using{' '}
                    <Link href="https://intuit.github.io/auto/pages/generated/next.html">
                      next
                    </Link>
                  </p>

                  <p className="mb-2">
                    Need to patch an old major release?{' '}
                    <Emphasize>auto</Emphasize> can automatically make branches
                    for{' '}
                    <Link href="https://intuit.github.io/auto/pages/generated/shipit.html#managing-old-major-versions">
                      old major versions
                    </Link>
                    !
                  </p>

                  <p>
                    Or if you don't want to worry about what command to you
                    need, just use{' '}
                    <Link href="https://intuit.github.io/auto/pages/generated/shipit.html">
                      shipit
                    </Link>
                    ! This command determines what type of release to make based
                    on the context it's run in.
                  </p>
                </>
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-purple-500 text-white text-center">
        <div className="max-w-4xl mx-10 lg:mx-auto pt-12 pb-16 flex flex-col items-center">
          <h2 className="text-xl mb-8">
            Stop worrying about your release and hit that merge button!
          </h2>

          <a
            href="https://intuit.github.io/auto/index.html"
            className="uppercase text-xl lg:text-2xl border-2 border-white rounded px-6 py-3"
          >
            <span className="pr-2">Get Started</span> 🎉
          </a>
        </div>
      </div>
    </main>
  </div>
);

export default Home;
