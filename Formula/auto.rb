class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.37.5/auto-macos.gz"
  version "v10.37.5"
  sha256 "eb98f6b3d6fb47136868db5b13598b7c4b71d5ae5e1ddffb252afb59fbcdb35e"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end