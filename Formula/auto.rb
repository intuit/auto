class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.13.1/auto-macos.gz"
  version "v10.13.1"
  sha256 "4ea54ed5f05c75f082034a0cdd3741f271662dcf99e0454d82421584d9812625"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end