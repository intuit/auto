class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.16.6/auto-macos.gz"
  version "v10.16.6"
  sha256 "8f7597c1bc2431b7b325a9683ebc7b4073d9491198f64cd2f836c22c65dd6f3f"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end