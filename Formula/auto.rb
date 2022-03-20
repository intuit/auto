class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.36.3/auto-macos.gz"
  version "v10.36.3"
  sha256 "b712ef7c4f1255375d92528f904cddfdfd26df26acbc224d4c83f2a193278731"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end