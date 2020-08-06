class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.49.5/auto-macos.gz"
  version "v9.49.5"
  sha256 "ab77953c46ee9a7c02465a55c53c69cfd6a31bb42a699df2929d91e211f522ca"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end