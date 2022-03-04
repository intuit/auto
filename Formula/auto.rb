class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.33.1/auto-macos.gz"
  version "v10.33.1"
  sha256 "0497f5199e740cdf659d1275873e1ce56d31280dc08de92b9c63f17429f6dbc4"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end