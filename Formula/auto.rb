class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.42.0/auto-macos.gz"
  version "v9.42.0"
  sha256 "53426522878206e82b1ea6b33dbd6b9fefb6ef64bb4af75e7f94d7551a4cf873"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end