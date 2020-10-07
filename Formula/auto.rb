class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.54.6/auto-macos.gz"
  version "v9.54.6"
  sha256 "269084c6808823a2421f0230f5e08c645b733cd2a378c910374729544c428bc7"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end