class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.35.1/auto-macos.gz"
  version "v9.35.1"
  sha256 "3f8f6c02b574c5a8b027ba70e92a365cb3a70d43b1f7084cd942faad2184ccba"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end