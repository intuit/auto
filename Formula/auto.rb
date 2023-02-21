class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.42.1/auto-macos.gz"
  version "v10.42.1"
  sha256 "ca29c95f9c97fac3b76f6c159952035538166eeab92e3ec2fa0839581edaad79"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end