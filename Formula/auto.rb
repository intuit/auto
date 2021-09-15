class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.32.0/auto-macos.gz"
  version "v10.32.0"
  sha256 "f5f8551c74ac0a5adc3cba18ed6373b9c5bb611c4d4b013faafe42d756309f9b"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end