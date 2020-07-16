class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.47.0/auto-macos.gz"
  version "v9.47.0"
  sha256 "f030f3660aa9d4126dbc0fd427f0ea6aa98b96db448ecb93eabdd6ffb1ac02ae"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end