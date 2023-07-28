class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.0.0/auto-macos.gz"
  version "v11.0.0"
  sha256 "10b1a4d6081c8a8cb2696cf4cd1a6af377e07e001cce3942e032189b63340e1f"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end