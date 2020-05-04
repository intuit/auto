class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.31.0/auto-macos.gz"
  version "v9.31.0"
  sha256 "8b0b76c61b4d0e1986629b8300729b6eae97a36bcd1e1d7dcd9e3394e727a549"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end