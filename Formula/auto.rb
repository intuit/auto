class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.24.1/auto-macos.gz"
  version "v10.24.1"
  sha256 "50e78267dd4235a432541fd37cff14b9936f9c9c8ca4e2884bcdf938869d10e3"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end