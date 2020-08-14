class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.50.9/auto-macos.gz"
  version "v9.50.9"
  sha256 "d019c89ec4650fb8f0ecd3dbac2659a42feb76fa63fa20017e1bb78f5a67fb01"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end