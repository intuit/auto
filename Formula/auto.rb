class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.50.10/auto-macos.gz"
  version "v9.50.10"
  sha256 "b9c2e39203446d6c3b6b0371315535940b7f8bdd94a3d92b2c70cb7b32ea246f"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end