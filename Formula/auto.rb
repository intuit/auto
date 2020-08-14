class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.50.6/auto-macos.gz"
  version "v9.50.6"
  sha256 "5d934b1a1d4a2b8282336e8b52dc80199808bdc85be48cc0f776dc31f6aa4206"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end