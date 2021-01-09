class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.5.1/auto-macos.gz"
  version "v10.5.1"
  sha256 "a84c3ca88389618a48ccea5f4dff399e952d8c28a0163cfa2ae9349176a221a1"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end