class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.2.5/auto-macos.gz"
  version "v10.2.5"
  sha256 "138f18354f8cf2e372e5ebd584257bf08b63ced2a00338ec50bf35ed91367f05"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end