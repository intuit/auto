class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.30.0/auto-macos.gz"
  version "v9.30.0"
  sha256 "8e650c6d07909246044b69c5c70ca7bebd6b886262d3cbdadc74f748a57f6f8d"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end