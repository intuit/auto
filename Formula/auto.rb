class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.43.2/auto-macos.gz"
  version "v9.43.2"
  sha256 "2429cfb8ef99b9f86fc9bad382f4bbe1a6dc5d09c55e24a1d3ec760c8878b0ea"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end