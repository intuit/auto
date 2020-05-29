class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.37.0/auto-macos.gz"
  version "v9.37.0"
  sha256 "15467b28e4ba5454b99b0feb1ec787bb11ae868d2fdba99650aea39608a983e1"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end