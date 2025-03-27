;; Device Registration Contract
;; Manages the registration of precision medical instruments

(define-data-var last-device-id uint u0)

(define-map devices
  { device-id: uint }
  {
    serial-number: (string-utf8 50),
    model: (string-utf8 50),
    manufacturer: (string-utf8 50),
    registration-date: uint,
    last-calibration-date: uint,
    calibration-frequency-days: uint
  }
)

(define-public (register-device
    (serial-number (string-utf8 50))
    (model (string-utf8 50))
    (manufacturer (string-utf8 50))
    (calibration-frequency-days uint))
  (let
    (
      (new-id (+ (var-get last-device-id) u1))
      (current-time (get-block-info? time (- block-height u1)))
    )
    (asserts! (is-some current-time) (err u1))
    (var-set last-device-id new-id)
    (map-set devices
      { device-id: new-id }
      {
        serial-number: serial-number,
        model: model,
        manufacturer: manufacturer,
        registration-date: (unwrap-panic current-time),
        last-calibration-date: u0,
        calibration-frequency-days: calibration-frequency-days
      }
    )
    (ok new-id)
  )
)

(define-read-only (get-device (device-id uint))
  (map-get? devices { device-id: device-id })
)

(define-public (update-calibration-date (device-id uint))
  (let
    ((current-time (get-block-info? time (- block-height u1))))
    (asserts! (is-some current-time) (err u1))
    (asserts! (is-some (get-device device-id)) (err u2))

    (let ((device (unwrap-panic (get-device device-id))))
      (map-set devices
        { device-id: device-id }
        (merge device { last-calibration-date: (unwrap-panic current-time) })
      )
      (ok true)
    )
  )
)
