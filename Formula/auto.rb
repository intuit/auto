class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.33.0/auto-macos.gz"
  version "v10.33.0"
  sha256 "d8e4c9ab6ece8ebd20c80f8bc972d8aa679d04f164bdccc5402fa00f9ec4d75e"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end