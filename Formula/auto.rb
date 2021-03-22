class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.21.3/auto-macos.gz"
  version "v10.21.3"
  sha256 "930eb54e715a06f473eb8192f6b48bb714bbdbbab5f9d7c89c58bb3e876f5f77"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end