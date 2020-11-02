class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.1.0/auto-macos.gz"
  version "v10.1.0"
  sha256 "8b181b487861a812c2a3342b065a4a1004e5c9da342d55135b526fcfe66233b5"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end