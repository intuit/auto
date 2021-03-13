class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.18.9/auto-macos.gz"
  version "v10.18.9"
  sha256 "a9eab876af5b8bff6c3539c2e57a4a17a9042bee87851bda0d96a075040c0a26"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end