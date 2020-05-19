class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.34.0/auto-macos.gz"
  version "v9.34.0"
  sha256 "e31a3add5d78f9d45dceb9418603d3c4a994ec6b4382f830b679350e3d6fc0e9"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end