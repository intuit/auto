class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v9.61.0/auto-macos.gz"
  version "v9.61.0"
  sha256 "e288e96bb5a865a086fc0666f552ada076c1b9a3109202ab65ce6b4ea8b3d451"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end