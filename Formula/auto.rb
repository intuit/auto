class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.0.0/auto-macos.gz"
  version "v10.0.0"
  sha256 "52c915830f6ef6cce08290944f965ef98f3b50f98d98e24a5957d7b936ac44f3"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end