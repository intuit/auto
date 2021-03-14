class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.20.1/auto-macos.gz"
  version "v10.20.1"
  sha256 "09500f07e90a1a7b74925c6914a5b4e66118be6aea0594ba4d98f45b05028d00"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end