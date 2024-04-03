class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.1.3/auto-macos.gz"
  version "v11.1.3"
  sha256 "9a00c72148eaf771b1d20152596717cb423e8b8ff4fa875858b7c44539243da4"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end