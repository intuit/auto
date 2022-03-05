class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.34.0/auto-macos.gz"
  version "v10.34.0"
  sha256 "cbd99fa0c00eb0c2f5a57e314a36a2338ec2492eb773e572725d00b3a378b61c"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end