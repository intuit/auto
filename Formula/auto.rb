class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.42.0/auto-macos.gz"
  version "v10.42.0"
  sha256 "3655f9656f268b4d8ff57425d172677cbd271bb3faf1943ff9320ada58f73f7e"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end