class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.48.3/auto-macos.gz"
  version "v9.48.3"
  sha256 "4ccb4cb4971505b823de06aecd11a521da6dd0f03fd145b805c30e071d368c2c"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end