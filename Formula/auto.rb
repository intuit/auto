class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.2.0/auto-macos.gz"
  version "v10.2.0"
  sha256 "699073ff3d4fb09f9b8d27e7d1a21de85d6a3965953cd99625f00afc4c86c545"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end