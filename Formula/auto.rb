class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.15.0/auto-macos.gz"
  version "v10.15.0"
  sha256 "d8c2f9ca9935b0181d5ab96da3ddebb9d7b520471e8f74d9e2318e872567cdd1"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end