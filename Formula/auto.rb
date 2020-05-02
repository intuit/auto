class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.30.4/auto-macos.gz"
  version "v9.30.4"
  sha256 "5af43302ccf07a6ae2e968368368ded49c395f3a7c38b7d251f433010cdd0ecc"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end