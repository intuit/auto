class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v11.0.3/auto-macos.gz"
  version "v11.0.3"
  sha256 "9ad0a32963a3d22aefedf68670ef336df2dc8e54eb73091792cac9059edb697a"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end