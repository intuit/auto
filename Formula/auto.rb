class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.16.4/auto-macos.gz"
  version "v10.16.4"
  sha256 "bfda7534f4b467dfc704491f8e21cc2bec003de9f3e4268f208f274d63529c4c"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end