class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.18.5/auto-macos.gz"
  version "v10.18.5"
  sha256 "170a5621ed92d0fd48d58508b30a8817cf8d1264286aefdc8991389e72737446"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end