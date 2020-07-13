class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto/home.html"
  url "https://github.com/intuit/auto/releases/download/v9.45.0/auto-macos.gz"
  version "v9.45.0"
  sha256 "a9e123ae8d19e6b6e845f17e400fef5d79702120141f7be5059ed6ef6d5cc05f"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end