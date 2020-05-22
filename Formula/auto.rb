class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.35.2/auto-macos.gz"
  version "v9.35.2"
  sha256 "7c9080a4bed8a0aace9711db0a58eda3e3f200442726a906e70705c4897c6f3b"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end